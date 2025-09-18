export async function getCertificateInfo() {
  const cadesplugin = (window as any).cadesplugin;
  if (!cadesplugin) {
    console.error("Cades plugin не найден");
    return null;
  }

  try {
    return await cadesplugin.async_spawn(function* (): Generator<Promise<any>, any, any> {
      const store = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
      yield store.Open(
        cadesplugin.CAPICOM_CURRENT_USER_STORE,
        cadesplugin.CAPICOM_MY_STORE,
        cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
      );

      const certs = yield store.Certificates;
      const count = yield certs.Count;

      if (count === 0) return null;

      const cert = yield certs.Item(1);

      const subject = yield cert.SubjectName;
      const issuer = yield cert.IssuerName;
      const validFrom = yield cert.ValidFromDate;
      const validTo = yield cert.ValidToDate;
      const thumbprint = yield cert.Thumbprint;

      yield store.Close();

      return { subject, issuer, validFrom, validTo, thumbprint };
    });
  } catch (err) {
    console.error("Ошибка при работе с Cades plugin:", err);
    return null;
  }
}
